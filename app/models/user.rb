class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
      :recoverable, :rememberable, :trackable, :validatable

  has_many :comments
  has_many :orders
  has_many :suggest_products
  has_many :recently_products

  scope :filter_by_name, -> search  do
    self.where("LOWER(first_name || ' ' || last_name) LIKE LOWER(?) \n
      or LOWER(email) LIKE LOWER(?)", "%#{search}%" , "%#{search}%")
  end
end
