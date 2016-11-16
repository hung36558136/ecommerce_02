class Admin::UsersController < ApplicationController
  layout "admin"
  def index
    @users = User.filter_by_name(params[:search])
      .page(params[:page]).per Settings.user.perpage
  end

  def update
    @user = User.find_by id: params[:id]
    if @user.update_attributes(user_params)
      flash[:success] = "Update profile successed!"
      redirect_to :back
    else
      flash[:fail] = "Update profile failed!"
    end
  end

  private

    def user_params
      params.permit :avatar_url, :first_name, :last_name, :email, :address
    end
end
