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
  validate :validate_specifications, on: [:create]

  private
  def validate_specifications
    if self.specifications.to_a.length < Settings.product.min_specification
      self.errors.add :specifications,
        I18n.t("validate.product.size.specifications")
    end
  end
end
