class Manufacturer < ApplicationRecord
  has_many :products

  scope :filter_by_name, -> search  do
    self.where("LOWER(name) LIKE LOWER(?)", "%#{search}%")
  end
end
