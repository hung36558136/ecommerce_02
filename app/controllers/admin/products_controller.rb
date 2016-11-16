class Admin::ProductsController < ApplicationController
  layout "admin"
  
  def index
    if params[:search_params].present?
      search_params = params[:search_params]
      @products = Product.find_for_advance_search(search_params[:term],
        search_params[:category_id], search_params[:manufacturer_id],
        search_params[:min_price], search_params[:max_price])
        .page(params[:page]).per Settings.product.per_page
      if request.xhr?
        render partial: "list", locals: {products: @products}
        return
      end
      @manufacturers = Manufacturer.all
    else
      @manufacturers = Manufacturer.all
      @products = Product.find_all
        .page(params[:page]).per Settings.product.per_page
    end
  end
  
  def create
    @product = Product.new product_params
    @product.specifications_attributes = params[:product][:specifications].as_json
    if @product.save
      render partial: "detail", locals: {product: @product}
    else
      render @product.errors.messages
    end
  end
  
  private
  def product_params
    params.require(:product).permit :name, :price, :category_id,
      :manufacturer_id
  end
end
