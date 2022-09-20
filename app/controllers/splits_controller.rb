class SplitsController < ApplicationController
  skip_forgery_protection

  before_action :set_user_cookie
  before_action :get_split, only: [:update, :show]
  before_action :require_user_cookie_match, only: [:update]

  def index
  end

  def update
    @split.data = params[:data]
    @split.save!
    head :accepted
  end

  def create
    Split.transaction do 
      s = Split.create!(id: SecureRandom.uuid, user_id: @user_id, data: {})
      render json: { id: s.id }
    end
  end

  def show
    s = Split.find_by(id: params[:id])
    return head :not_found if s.nil?

    puts cookies.encrypted[:user_id]
    puts @split.user_id
    render json: { id: s.id, data: s.data, read_only: @split.user_id != cookies.encrypted[:user_id] }
  end

  def set_user_cookie 
    if cookies.encrypted[:user_id].nil?
      cookies.encrypted[:user_id] = SecureRandom.uuid
    end

    @user_id = cookies.encrypted[:user_id]
  end

  def require_user_cookie_match
    return head :unauthorized if @split.user_id != cookies.encrypted[:user_id]
  end

  def get_split 
    s = Split.find_by(id: params[:id])
    return head :not_found if s.nil?
    @split = s
  end
end