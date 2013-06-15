# encoding: utf-8

Rake::TaskManager.class_eval do
  def remove_task(task_name)
    @tasks.delete(task_name.to_s)
  end
end

Rake.application.remove_task 'gedi:install'
Rake.application.remove_task 'gedi:test:prepare'

def execute_task task
  t = Rake::Task[task]
  puts "starting #{task} #{t} (by caller #{caller[0]})"
  Rake::Task["railties:install:migrations"].reenable
  t.reenable
  r = t.invoke
  puts "#{task} done! #{r}"
end

namespace :gedi do
    
    task install: :environment do
      execute_task "db:create"
      execute_task "gedi:new_module:db:migrate"
      execute_task "db:migrate"
      execute_task "gedi:new_module:db:seeds"
    end
    
    desc "Fill database with sample data"
    task populate_test: :environment do
      require File.dirname(__FILE__) + '/../../spec/factories.rb' if FileTest.exist? File.dirname(__FILE__) + '/../../spec/factories.rb'      
    end
    
    namespace :test do
      task prepare: :environment do
        ActiveRecord::Base.establish_connection('test')
        execute_task "gedi:analysis:db:seeds"
        ActiveRecord::Base.establish_connection(ENV['RAILS_ENV'])  #Make sure you don't have side-effects!
      end
    end
    
    namespace :remote do
      namespace :db do
        task seeds: :environment do
          execute_task "gedi:seeds"
          execute_task "gedi:analysis:db:load_seed"
          execute_task "gedi:new_module:db:load_seed"
        end
        
        task load_seed: :environment do
          Gedi::NewModule::Engine.load_seed
        end
        
        task migrate: :environment do
          execute_task "gedi:db:migrations"
          execute_task "gedi_analysis:install:migrations"
          execute_task "gedi_new_module:install:migrations"
        end
      end
    end
end