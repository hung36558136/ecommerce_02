Rails.application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: "callbacks"}

  root "pages#home"
  get "/pages/:page", to: "pages#show"

  namespace :admin do
    root "managers#index"
    resources :managers, :categories, :users, :products
    resource :users, :categories, :products
  end
end
