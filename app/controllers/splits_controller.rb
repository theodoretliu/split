class SplitsController < ApplicationController
  skip_forgery_protection

  before_action :set_user_cookie
  before_action :get_split, only: [:update, :show]
  before_action :require_user_cookie_match, only: [:update]

  def index
    data = {}

    if params[:q]
      decoded_data = JSON.parse(Base64.decode64(params[:q])).with_indifferent_access

      final_data = {}

      final_data[:total] = decoded_data[:total]
      final_data[:venmo] = decoded_data[:venmo]
      final_data[:description] = decoded_data[:description]
      final_data[:splitters] = decoded_data[:splitters]
      final_data[:items] = []

      splitters_map = final_data[:splitters].map.with_index { |splitter, i| [i, splitter] }.to_h

      decoded_data[:data].each do |item|
        item_name = item[0]
        item_price = item[1]
        item_splitters = item[2..]

        final_item = {
          name: item_name,
          price: item_price,
          splitters: [],
        }

        item_splitters.each_with_index do |check, i|
          if check == 1
            final_item[:splitters] << splitters_map[i]
          end
        end

        final_data[:items] << final_item
      end

      data = final_data
    end

    s = Split.create!(id: SecureRandom.uuid, user_id: @user_id, data: data)
    redirect_to(split_path(s.id))
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

    respond_to do |format|
      format.html { render "index" }
      format.json { render json: { id: s.id, data: s.data, read_only: @split.user_id != cookies.encrypted[:user_id] } }
    end
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
    puts params[:id]
    s = Split.find_by(id: params[:id])
    return head :not_found if s.nil?
    @split = s
  end
end
