def with_s3
  s3 = Aws::S3::Resource.new(
    region: 'us-east-1',
    credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
  )
  yield(s3.bucket('wybren-acro'))
end