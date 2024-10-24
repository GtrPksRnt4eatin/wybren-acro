require 'bundler'; Bundler.require(:default)
Dir["ruby/*.rb"].each { |file| require_relative file }

set :bind, '0.0.0.0'
set :server, :thin
set :views, File.join(File.dirname(__FILE__), 'slim')

post '/vidlink' do
  content_type :json
  with_db do |conn|
    with_s3 do |bucket|
      key = /(.*)\.(.*)/.match(params[:key])[1]
      puts "key= #{key}"
      webm = bucket.object("#{key}.webm")
      mp4  = bucket.object("#{key}.mp4")
      obj = { 
        "webm" => webm.presigned_url(:get, expires_in: 900),
        "mp4"  => mp4.presigned_url(:get, expires_in: 900)
      }
      JSON.generate obj
    end
  end
end

post '/player' do
  @path = params[:path]
  slim :index
end

get '/videos' do
  content_type :json
  with_db do |conn|
  	resp = conn.exec "SELECT array_to_json(array_agg(row)) FROM (SELECT * FROM vids) AS row"
    resp.getvalue(0,0)
  end
end

get '/vidlist' do
  content_type :json
  with_db do |conn|
  	resp = conn.exec "SELECT array_to_json(array_agg(row)) FROM (SELECT vid_key FROM vids) AS row"
    resp.getvalue(0,0)
  end
end

get '/clips' do
  content_type :json
  with_db do |conn|
    resp = conn.exec "SELECT array_to_json(array_agg(row)) FROM (SELECT * FROM clips) AS row"
    resp.getvalue(0,0)
  end
end