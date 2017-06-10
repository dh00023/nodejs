var Person={};

Person['age']=23;
Person['name']="정다혜";
Person.mobile = '010-0000-0000';

console.log('나이 : %d \n 이름 : %s \n 번호 : %s',Person.age,Person.name,Person['mobile']);