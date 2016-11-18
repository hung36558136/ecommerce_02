class Manufacturer < ApplicationRecord
  has_many :products
  validates :name, uniqueness: true
  validates :name, presence: true, allow_blank: false

  scope :filter_by_name, -> search  do
    self.where("LOWER(name) LIKE LOWER(?)", "%#{search}%")
  end
end
