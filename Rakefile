#timestamp
time = Time.new.strftime("%Y%m%d%H%M")
newTag = time.to_s

task :tag do
    sh "git tag -a #{newTag} -m 'new release at #{newTag}'"
    sh "git push --tags"
end
