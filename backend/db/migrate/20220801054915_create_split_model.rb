class CreateSplitModel < ActiveRecord::Migration[7.0]
  def change
    create_table :splits, id: :string do |t|
      t.string :user_id, null: false
      t.json :data, null: false

      t.index :user_id

      t.timestamps
    end
  end
end
