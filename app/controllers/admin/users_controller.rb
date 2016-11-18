class Admin::UsersController < ApplicationController
  layout "admin"
  before_action :load_user , only: [:update, :destroy]

  def index
    @users = User.filter_by_name(params[:search])
      .order(created_at: :DESC)
      .page(params[:page]).per Settings.user.perpage
  end

  def update
    if @user.update_attributes user_params
      flash[:notice] = t ".update_success"
      redirect_to :back
    else
      flash[:notice] = t ".update_failed"
      redirect_to :back
    end
  end

  def destroy
    if @user.destroy
      flash[:notice] = t ".delete_success"
      redirect_to :back
    else
      flash[:notice] = t ".delete_fail"
      redirect_to :back
    end
  end

  private

    def user_params
      params.permit :avatar_url, :first_name, :last_name, :email, :address
    end

    def load_user
      @user = User.find_by id: params[:id]
      if @user.nil?
        flash[:notice] = t ".notexist"
        redirect_to :back
      end
    end
end
