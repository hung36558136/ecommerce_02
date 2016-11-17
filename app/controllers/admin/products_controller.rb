class Admin::ProductsController < ApplicationController
  layout "admin"
  before_action :load_manufacturer
  
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
    else
      @products = Product.find_all
        .page(params[:page]).per Settings.product.per_page
    end
  end
  
  def create
    @product = Product.new product_params
    @product.specifications_attributes = params[:product][:specifications]
      .as_json
    if @product.save
      render partial: "detail", locals: {product: @product}
    else
      render @product.errors.messages
    end
  end
  
  def update
    @product = Product.find_by id: params[:product][:id]
    if @product.present?
      @product.specifications_attributes = params[:product][:specifications]
        .as_json
      if @product.update_attributes product_params
        render plain: t(".success")
      else
        render @product.errors.messages
      end
    else
      render plain: t("js.bad_request")
    end
  end
  
  private
  def product_params
    params.require(:product).permit :name, :price, :category_id,
      :manufacturer_id
  end
  
  def load_manufacturer
    @manufacturers = Manufacturer.all
  end
end
