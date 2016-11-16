class Admin::UsersController < ApplicationController
  layout "admin"
  def index
    @users = User.filter_by_name(params[:search])
      .order(id: :DESC)
      .page(params[:page]).per Settings.user.perpage
  end

  def update
    @user = User.find_by id: params[:id]
    if @user.nil?
      flash[:notice] = "User does not exsit!"
      redirect_to :back
    elsif @user.update_attributes user_params
      flash[:notice] = "Update profile successed!"
      redirect_to :back
    else
      flash[:notice] = "Update profile failed!"
    end
  end

  private

    def user_params
      params.permit :avatar_url, :first_name, :last_name, :email, :address
    end
end
