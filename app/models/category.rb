class Category < ApplicationRecord
  include TheSortableTree::Scopes
  acts_as_nested_set
  acts_as_paranoid column: :deleted_at
  has_many :products
  validates :name, presence: true, uniqueness: true, allow_blank: false

  class << self
    def find_by_name name
      categories = self.includes(:products)
        .where("LOWER(categories.name) LIKE LOWER(?)", "%#{name}%").order(:lft)
      left, right = -1, -1
      result = categories.to_a
      categories.each do |category|
        if category[:lft] > left && category[:rgt] < right
          next
        end
        parent_id = category[:parent_id]
        while true do
          unless parent_id.nil?
            parent_category = self.find_by id: category[:parent_id]
            result.push parent_category unless result.include? parent_category
            left = parent_category[:lft]
            right = parent_category[:rgt]
            parent_id = parent_category[:parent_id]
          else
            break
          end
        end
      end
      result.sort {|a,b| a[:lft] <=> b[:lft]}
    end

    def delete_category_by_id id
      category = self.where(id: id).first
      if category.present? &&
        Product.where("category_id >= ? AND category_id <= ?",
          category.lft, category.rgt).length == 0
        Category.where("lft >= ? AND rgt <= ?", self.lft, self.rgt)
          .update_all deleted_at: Time.now
        return true
      end
      false
    end
  end
end
