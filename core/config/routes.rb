
Gedi::Engine.routes.prepend do
	scope module: 'new_module' do	
		resources :check_analyses
  end

	end
end
