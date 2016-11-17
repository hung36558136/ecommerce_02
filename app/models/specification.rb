class Specification < ApplicationRecord
  belongs_to :product, optional: true
end
