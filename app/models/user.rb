class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  
  has_many :comments
  has_many :orders
  has_many :suggest_products
  has_many :recently_products
  
  scope :filter_by_name, -> search do
    self.where("LOWER(first_name || ' ' || last_name) LIKE LOWER(?) \n
      or LOWER(email) LIKE LOWER(?)", "%#{search}%", "%#{search}%")
  end
  
  class << self
    def from_omniauth auth
      where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
        user.provider = auth.provider
        user.uid = auth.uid
        user.email = auth.info.email
        user.first_name = auth.info.first_name
        user.last_name = auth.info.last_name
        user.password = Devise.friendly_token[0, 20]
        user.avatar_url = auth.info.image + '?type=large'
        user.role = "2"
        user.save
      end
    end
  end
end
