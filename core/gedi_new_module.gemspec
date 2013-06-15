$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "gedi/new_module/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "gedi_new_module"
  s.version     = Gedi::NewModule::VERSION
  s.authors     = ["Bruno Guerra"]
  s.email       = ["bruno@woese.com"]
  s.homepage    = "gedi.woese.com"
  s.summary     = ""
  s.description = " "

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "gedi"
  s.add_dependency "gedi_analysis"
  
  s.add_development_dependency 'pg', '~> 0.12.2'
  s.add_development_dependency 'rspec'
  
end
