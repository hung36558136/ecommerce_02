class Product < ApplicationRecord
  belongs_to :category
  has_many :comments
  has_many :recently_products
  has_many :specifications
  has_many :order_details
  belongs_to :manufacturer
  accepts_nested_attributes_for :specifications, allow_destroy: true,
    reject_if: :all_blank
  
  validates :manufacturer_id, presence: true
  validates :category_id, presence: true
  validates :price, presence: true,
    numericality: {only_float: true, greater_than: 0}
  
  scope :with_category_manufacturer, -> () {
    self.includes :category, :manufacturer
  }
  
  scope :like_name, -> (name) {
    unless name.blank? || name.nil?
      self.where("LOWER(name) LIKE LOWER(?)", "%#{name}%")
    end
  }
  
  scope :in_category, -> (category_id) {
    self.where category_id: category_id if category_id.present?
  }
  
  scope :in_manufacturer, -> (manufacturer_id) {
    self.where manufacturer_id: manufacturer_id if manufacturer_id.present?
  }
  
  scope :greater_than_price, -> (min_price) {
    min_price = Float(min_price) rescue nil
    unless min_price.blank? || min_price.nil? || min_price.nil?
      self.where("price >= ?", min_price.to_f)
    end
  }
  
  scope :smaller_than_price, -> (max_price) {
    max_price = Float(max_price) rescue nil
    unless max_price.blank? || max_price.nil? || max_price.nil?
      self.where("price <= ?", max_price.to_f)
    end
  }
  
  validate :validate_specifications, on: [:create]
  after_initialize :init
  
  def init
    self.total_view ||= 0
  end
  
  class << self
    def find_all
      self.with_category_manufacturer.all
    end
    
    def find_for_advance_search name, category_id, manufacturer_id, min_price,
      max_price
      self.with_category_manufacturer.like_name(name)
        .in_category(category_id).in_manufacturer(manufacturer_id)
        .greater_than_price(min_price).smaller_than_price max_price
    end
    
    def delete_by_ids ids
      ids_destroy = [];
      ids.each do |id|
        ids_destroy.push(id) unless OrderDetail.exists? product_id: id
      end
      self.where(id: ids_destroy).destroy_all
      ids_destroy
    end
  end
  
  private
  def validate_specifications
    if self.specifications.to_a.length < Settings.product.min_specification
      self.errors.add :specifications,
        I18n.t("validate.product.size.specifications")
    end
  end
end
