
export declare class Repository<Entity> {

  insert(entity : Entity): Entity
  findAll(): Entity[]
  findOne(id: string): Entity
  delete(id: string): Entity
}
