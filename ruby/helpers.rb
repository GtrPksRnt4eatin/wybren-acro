def with_catch
  return yield
rescue Exception => e
  p "///////////////////"
  p e
  p "///////////////////"
  status 500
  return e.message
end

def with_db
  with_catch do
    begin 
      conn = PG::Connection.new(ENV['DATABASE_URL'])
      yield conn 
    ensure conn.close unless conn.nil?
    end
  end 
end

def no_scaling; "<meta name='viewport' content='width=device-width, initial-scale=1'>" end
def css(path) handleArray(path) { |x| "\n<link rel='stylesheet' type='text/css' href='css/#{x}.css'/>" } end
def js(path)  handleArray(path) { |x| "\n<script src='js/#{x}.js'></script>" } end

def handleArray(arg)
  if    arg.is_a? String then yield(arg)
  elsif arg.is_a? Array  then arg.map{ |x| yield(x) }.join('')
  else  '' end
end