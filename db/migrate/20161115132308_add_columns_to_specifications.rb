class AddColumnsToSpecifications < ActiveRecord::Migration
  def change
    add_column :specifications, :value, :string
  end
end
