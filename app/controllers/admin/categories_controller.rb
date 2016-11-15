class Admin::CategoriesController < ApplicationController
  include TheSortableTreeController::Rebuild
  layout "admin"

  def index
    if params[:q]
      @categories = Category.find_by_name(params[:q])
      render partial: "list", locals: {categories: @categories}
    else
      @category = Category.new
      @categories = Category.order(:lft)
    end
  end

  def create
    @category = Category.new category_params
    if @category.save
      render partial: "detail", locals: {category: @category}
    else
      render plain: t(".fail")
    end
  end

  def update
    @category = Category.find_by id: params[:id]
    if @category.present? && @category.update_attributes(category_params)
      render plain: t(".success")
    else
      render plain: t(".fail")
    end
  end

  def destroy
    if params[:id]
      if Category.delete_category_by_id params[:id]
        flash[:notice] = t ".success"
        redirect_to :back
        return
      end
    end
    flash[:notice] = t ".fail"
    redirect_to :back
  end

  private
  def category_params
    params.require(:category).permit :name, :parent_id
  end
end
