20.times do |i|
  email = "demo#{i+1}@gmail.com"
  password = "123456"
  first_name = "User"
  last_name = "#{i+1}"
  role = "2"
  sign_in_count = "1"
  address = "Street #{i+1}"
  User.create!(email: email, password: password, role: role,
    sign_in_count: sign_in_count, last_name: last_name, first_name: first_name,
    address: address)
end

@manufacturer = Manufacturer.new name: "Dell"
@manufacturer.save
@manufacturer = Manufacturer.new name: "HP"
@manufacturer.save
@manufacturer = Manufacturer.new name: "Lenovo"
@manufacturer.save
@manufacturer = Manufacturer.new name: "Asus"
@manufacturer.save
@manufacturer = Manufacturer.new name: "Acer"
@manufacturer.save
@manufacturer = Manufacturer.new name: "Apple"
@manufacturer.save
@manufacturer = Manufacturer.new name: "Sony"
@manufacturer.save

20.times do |i|
  name = "Manufacturer#{i+1}"
  Manufacturer.create!(name: name)
end
