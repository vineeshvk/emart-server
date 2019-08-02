import { contextType } from '..';
import { Inventory } from '../../entity/Inventory';
import { ACCOUNT_TYPE } from '../../config/constants';
import { Image } from '../../entity/Image';

const resolvers = {
  Query: { getAllInventory },
  Mutation: { addNewInventory, updateInventory, deleteInventory },
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

  return { inventory };
}

/* ----------------------ADD_ITEMS------------------------ */

async function addNewInventory(
  _,
  { name, perUnit, price, unit, category, inStock, imageString },
  { staff }
) {
  if (!staff)
    return { error: { message: 'NO ACCESS', path: 'addNewInventory' } };

  const inventory = Inventory.create({
    name,
    perUnit,
    price,
    unit,
    category,
    inStock,
  });

  await inventory.save();

  if (imageString) {
    const image = Image.create({
      inventoryId: inventory.id,
      imageString: imageString,
    });
    await image.save();
    console.log(image);
  }

  return { inventory: [inventory] };
}

/* ----------------------UPDATE_ITEMS------------------------ */

async function updateInventory(
  _,
  { name, perUnit, price, unit, category, inStock, inventoryId, imageString },
  { staff }: contextType
) {
  if (
    staff.accountType != ACCOUNT_TYPE.GOD_ADMIN &&
    staff.accountType != ACCOUNT_TYPE.STORE_ADMIN
  )
    return { error: { message: 'NO ACCESS', path: 'updateInventory' } };

  const inventory = await Inventory.findOne({ id: inventoryId });

  if (!inventory)
    return { error: { message: 'Inventory Missing', path: 'updateInventory' } };

  if (name) inventory.name = name;
  if (perUnit) inventory.perUnit = perUnit;
  if (price) inventory.price = price;
  if (unit) inventory.unit = unit;
  if (category) inventory.category = category;
  if (inStock) inventory.inStock = inStock;

  console.log(imageString);

  if (imageString) {
    const image = await Image.findOne({ inventoryId: inventory.id });
    console.log(image);

    if (image) {
      image.imageString = imageString;
      await image.save();
    } else {
      const newImage = Image.create({ inventoryId: inventory.id, imageString });
      await newImage.save();
    }
  }

  await inventory.save();

  return { inventory: [inventory] };
}

/* ----------------------DELETE_ITEMS------------------------ */

async function deleteInventory(_, { inventoryId }, { staff }: contextType) {
  if (
    staff.accountType != ACCOUNT_TYPE.GOD_ADMIN &&
    staff.accountType != ACCOUNT_TYPE.STORE_ADMIN
  )
    return { error: { message: 'NO ACCESS', path: 'updateInventory' } };

  const inventory = await Inventory.findOne({ id: inventoryId });
  await inventory.remove();

  return { inventory: [inventory] };
}

export default resolvers;
