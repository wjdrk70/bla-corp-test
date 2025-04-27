import { ServiceProduct } from '@/src/product-service/domain/service.product';

describe('Service Product Entity',()=>{

  it('정상적으로 ServiceProduct 생성',()=>{
    const serviceProduct = ServiceProduct.create(1,1,true)


    expect(serviceProduct).toBeDefined()
    expect(serviceProduct).toBeInstanceOf(ServiceProduct)
  })


})