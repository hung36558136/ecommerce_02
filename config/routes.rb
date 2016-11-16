Rails.application.routes.draw do
  devise_for :users

  root "pages#home"
  get "/pages/:page", to: "pages#show"

  namespace :admin do
    root "managers#index"
    resources :managers, :categories, :users, :manufacturers
    resource :categories
    resource :users
    resource :manufacturers
  end
end
