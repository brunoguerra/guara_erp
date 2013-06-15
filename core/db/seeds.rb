#encoding: utf-8
module Gedi
  module NewModule  
  begin
    
    ::Guara::SystemModule.create([
                   { name: 'Gedi::NewModule::CheckRemote' },
                  ])
      
  	rescue Exception => exception
  	    logger =  Logger.new(STDOUT)
  	    if exception.respond_to?(:record) && !exception.record.nil?
  	      logger.error("Error running task db:seed - #{exception.message} #{exception.class} #{exception.record.to_yaml}\n#{exception.record.errors.to_yaml}\n\n")
  	    else
  	      logger.error("Error running task db:seed - #{exception.message} #{exception.class}\n\n")
  	    end
  	    logger.info exception.backtrace.to_yaml
  	end
  end
  
end