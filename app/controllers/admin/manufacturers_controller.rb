class Admin::ManufacturersController < ApplicationController
  layout "admin"
  def index
    @manufacturers = Manufacturer.filter_by_name(params[:search])
      .order(id: :DESC)
      .page(params[:page]).per Settings.manu.perpage
  end

  def create
    @manufacturer = Manufacturer.new manufacturer_params
    if @manufacturer.present?
      flash[:notice] =
        "Manufacturer has been exist, please add new manufacturer!"
      redirect_to :back
    elsif @manufacturer.save
      redirect_to :back
    else
      flash[:notice] = "Add manufacturer failed!"
    end
  end

  def update
    @manufacturer = Manufacturer.find_by id: params[:id]
    if @manufacturer.nil?
      flash[:notice] = "Manufacturer does not exsit!"
      redirect_to :back
    elsif @manufacturer.update_attributes manufacturer_params
      flash[:notice] = "Update manufacturer successed!"
      redirect_to :back
    else
      flash[:notice] = "Update manufacturer failed!"
    end
  end

  def destroy
    @manufacturer = Manufacturer.find_by id: params[:id]
    if @manufacturer.destroy
      redirect_to :back
    end
  end

  private

    def manufacturer_params
      params.permit :name
    end
end
