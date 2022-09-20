Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "splits#index"

  scope :api do 
    resources :splits
  end

  get "*react", to: "splits#index"
end
