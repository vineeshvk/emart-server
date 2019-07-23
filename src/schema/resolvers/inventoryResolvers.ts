import { contextType } from '..';
import { Inventory } from '../../entity/Inventory';

const resolvers = {
  Query: { getAllInventory },
  Mutation: { addNewInventory },
};

//Query

/* ---------------------GET_INVENTORY-------------------- */
//TODO: implement filter
async function getAllInventory(
  _,
  { categories }: { categories: string[] },
  { customer, staff }: contextType
) {
  if (!customer && !staff) return { error: { message: 'NO ACCESS' } };

  let inventory = await Inventory.find();
  let inventories: Inventory[] = [];

  if (categories)
    categories.forEach(category => {
      inventories.push(
        ...inventory.filter(inven => inven.category == category)
      );
    });
  else inventories = inventory;

  return { inventory: inventories };
}

/* ----------------------ADD_ITEMS------------------------ */

async function addNewInventory(
  _,
  { name, perUnit, price, unit, category, inStock },
  { staff }
) {
  if (!staff) return { error: { message: 'NO ACCESS' } };

  const inventory = Inventory.create({
    name,
    perUnit,
    price,
    unit,
    category,
    inStock,
  });

  await inventory.save();

  return { inventory: [inventory] };
}

export default resolvers;
