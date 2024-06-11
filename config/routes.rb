Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "splits#index"

  get "/splits/:id/view", to: "splits#show"

  resources :splits

  # get "*react", to: "splits#index"
end
