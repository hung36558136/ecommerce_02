class Admin::ProductsController < ApplicationController
  layout "admin"

  def index
    @manufacturers = Manufacturer.all
  end

  def create
    @product = Product.new product_params
    @product.specifications_attributes = params[:product][:specifications].as_json
    if @product.save
      render plain: "true"
    else
      render @product.errors.messages
    end
  end

  private
  def product_params
    params.require(:product).permit :name, :category_id, :manufacturer_id
  end
end
