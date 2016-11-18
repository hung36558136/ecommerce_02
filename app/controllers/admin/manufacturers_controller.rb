class Admin::ManufacturersController < ApplicationController
  layout "admin"
  before_action :load_manufacturer, only: [:update, :destroy]
  def index
    @manufacturers = Manufacturer.filter_by_name(params[:search])
      .order(created_at: :DESC)
      .page(params[:page]).per Settings.manu.perpage
  end

  def create
    @manufacturer = Manufacturer.new manufacturer_params
    if @manufacturer.save
      flash[:notice] = t ".add_success"
      redirect_to :back
    else
      flash[:notice] = t ".save"
      redirect_to :back
    end
  end

  def update
    if @manufacturer.update_attributes manufacturer_params
      flash[:notice] = t ".update_success"
      redirect_to :back
    else
      flash[:notice] = t ".update_failed"
      redirect_to :back
    end
  end

  def destroy
    if @manufacturer.destroy
      flash[:notice] = t ".delete_success"
      redirect_to :back
    else
      flash[:notice] = t ".delete_fail"
    end
  end

  private

    def manufacturer_params
      params.permit :name
    end

    def load_manufacturer
      @manufacturer = Manufacturer.find_by id: params[:id]
      if @manufacturer.nil?
        flash[:notice] = t ".check"
        redirect_to :back
      end
    end
end
