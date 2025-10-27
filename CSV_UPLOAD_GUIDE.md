# CSV Product Upload Guide

## How to Upload Products via CSV

The admin panel now supports bulk product uploads using CSV files. This allows you to add multiple products at once instead of entering them one by one.

## CSV File Format

Your CSV file must have the following columns in the **first row** (header row):

```
name,description,price,originalPrice,category,subcategory,type,image,badge,stockQuantity,flavors,ingredients,aboutProduct
```

### Column Descriptions

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `name` | ✅ Yes | Product name | Premium Dog Food |
| `description` | ✅ Yes | Short product description | High-quality nutrition for your dog |
| `price` | ✅ Yes | Current price (number only, no $ sign) | 45.99 |
| `originalPrice` | ❌ No | Original price before discount | 59.99 |
| `category` | ✅ Yes | Main category (dogs/cats) | dogs |
| `subcategory` | ✅ Yes | Product subcategory | food |
| `type` | ✅ Yes | Specific product type | dry food |
| `image` | ✅ Yes | Product image URL | https://example.com/image.jpg |
| `badge` | ❌ No | Badge text (e.g., "Best Seller", "New") | Best Seller |
| `stockQuantity` | ✅ Yes | Number of items in stock | 100 |
| `flavors` | ❌ No | Available flavors separated by semicolons | Chicken;Beef;Lamb |
| `ingredients` | ❌ No | Product ingredients | Chicken meal, brown rice, vegetables |
| `aboutProduct` | ❌ No | Detailed product description | Premium dog food made with real meat |

## Important Rules

1. **Header Row**: The first line MUST contain the column names exactly as shown above
2. **No Commas in Values**: If your description or other fields contain commas, the CSV parser may break. Use semicolons instead.
3. **Flavors**: Multiple flavors should be separated by semicolons (`;`), not commas
4. **Empty Fields**: Leave empty if not applicable (but don't skip the comma)
5. **Categories**: Use lowercase for category, subcategory, and type
6. **Numbers**: Don't include currency symbols ($) or commas in numbers

## Example CSV File

```csv
name,description,price,originalPrice,category,subcategory,type,image,badge,stockQuantity,flavors,ingredients,aboutProduct
Premium Dog Food,High-quality nutrition for your dog,45.99,59.99,dogs,food,dry food,https://example.com/dog-food.jpg,Best Seller,100,Chicken;Beef;Lamb,Chicken meal; brown rice; vegetables,Premium dog food made with real meat and wholesome ingredients
Cat Toy Bundle,Interactive toys for cats,29.99,39.99,cats,toys,interactive,https://example.com/cat-toys.jpg,New,50,,Feathers; bells; catnip,A collection of engaging toys to keep your cat entertained
Dog Leash,Durable nylon leash,19.99,,dogs,accessories,leash,https://example.com/leash.jpg,,75,Red;Blue;Black,Nylon; metal clasp,Strong and comfortable leash for daily walks
Cat Food Wet,Gourmet wet cat food,3.99,4.99,cats,food,wet food,https://example.com/cat-food.jpg,,200,Salmon;Tuna;Chicken,Real fish; vitamins; minerals,Delicious wet food your cat will love
```

## How to Use

1. **Prepare your CSV file** following the format above
2. **Save it** with a `.csv` extension
3. **Go to Admin Panel** → Products tab
4. **Click "Upload CSV"** button
5. **Select your CSV file**
6. **Wait for confirmation** - you'll see a toast message showing how many products were added successfully

## Sample File

A sample CSV file (`product-upload-example.csv`) is included in the project root directory. You can use it as a template.

## Troubleshooting

**Problem**: "0 products added successfully"
- **Solution**: Check that your first row contains the exact column names
- Make sure there are no extra spaces in column names
- Verify the file is saved as `.csv` format

**Problem**: Some products added, some failed
- **Solution**: Check the browser console (F12) for specific error messages
- Verify all required fields are filled
- Check that prices are valid numbers
- Ensure categories match existing categories

**Problem**: Flavors not showing up
- **Solution**: Make sure flavors are separated by semicolons (`;`), not commas
- Example: `Chicken;Beef;Lamb` ✅
- Wrong: `Chicken,Beef,Lamb` ❌

## Notes

- Products uploaded via CSV will have default values for:
  - `rating`: 0
  - `reviews`: 0
  - `inStock`: true
- You can edit these values individually after upload if needed
- The CSV upload does NOT update existing products - it only adds new ones

