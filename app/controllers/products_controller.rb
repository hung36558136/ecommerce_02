class ProductsController < ApplicationController
  def show
    @product = Product.with_category_manufacturer_specifications.find_by id: params[:id]
    if @product.nil?
      render file: "public/404.html", status: :not_found
    else
      @product.total_view += 1
      @product.save
    end
  end
end
