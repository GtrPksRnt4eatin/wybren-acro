get '/'            do slim :index end
	
get '*/:file.html' do slim params[:file].to_sym end
get '*/:file.js'   do send_file "js/#{params[:file]}.js"   end
get '*/:file.css'  do send_file "css/#{params[:file]}.css" end

get /.*\.(jpeg|jpg|png|gif|ico|svg)/ do
	path = request.path.sub('images', 'datatables')
	return 404 unless File.exist? "img#{path}"
	send_file "img#{path}"
end

get /.*\.(ttf|woff)/ do
	path = request.path.sub('/css/fonts','')
	return 404 unless File.exist? "fonts#{path}"
	send_file "fonts#{path}"
end

get /.*\.(webm)/ do
	return 404 unless File.exist? "vid#{request.path}"
	send_file "vid#{request.path}"
end