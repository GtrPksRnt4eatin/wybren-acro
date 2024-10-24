get '/clips' do
  content_type :json
  with_db do |conn|
    DataTableJSON conn.exec "SELECT clip_id,clip_numpeople,clip_category,clip_name FROM clips;"
  end
end

get '/flips' do
  content_type :json
  with_db do |conn|
    DataTableJSON conn.exec "SELECT clip_id,flip_id,flip_rotate_quarters,flip_rotate_direction,flip_rotate_shape,flip_twist,clip_name FROM flips LEFT JOIN clips ON clip_id = flip_clip_id"
  end
end

get '/poses' do 
  content_type :json
  with_db do |conn|
    DataTableJSON conn.exec "SELECT * FROM poses"
  end
end

def DataTableJSON(rows) 
  obj = { :data => [] }
  rows.each do |row|
    arr = []
    row.each { |col,val| arr << val }
    obj[:data] << arr
  end
  JSON.generate obj
end
