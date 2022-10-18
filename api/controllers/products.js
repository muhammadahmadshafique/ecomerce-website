import Product from "../models/products"


export const createproducts= async (req, res) => {

    req.body.user= req.auth._id
    

   try {

    const productsave= new Product(req.body)
    await productsave.save()
    res.json(productsave)
    
   } catch (error) {
    res.json({message:"Product not Created. Somthing Wrong"})
   }
}

export const getallproducts= async (req,res)=>{
    try {
        const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 4;
        const lessthan = parseInt(req.query.lessprice) || 100000000;
        const greaterthan = parseInt(req.query.greaterprice) || 0;
        const searchrating = parseInt(req.query.rating) || 5;



		const search = req.query.search || "";
		let sort = req.query.sort || "rating";
		let category = req.query.category || "All";
        let productcategories=[]

        const allproducts= await Product.find({})
        for (let i = 0; i < allproducts.length; i++) {
            productcategories.push(allproducts[i].category);
          }
 
        
        const categoryOptions=[...productcategories]
        // console.log("This is all categories,",categoryOptions)
        // console.log("This is all categories,",categoryOptions)
        // const genreOptions = [
		// 	"Action",
		// 	"Romance",
		// 	"Fantasy",
		// 	"Drama",
		// 	"Crime",
		// 	"Adventure",
		// 	"Thriller",
		// 	"Sci-fi",
		// 	"Music",
		// 	"Family",
		// ];

		category === "All"
			? (category = [...categoryOptions])
			: (category = req.query.category.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}
        console.log("Less Than and greater than,",lessthan,greaterthan)
		const products = await Product.find({
            $or: [
              { name: { $regex: search,$options: "i" } },
              { description: { $regex: search,$options: "i"} },
              { category: { $regex: search,$options: "i"} },
            ],
            price: {
                $gte: greaterthan,
                $lte: lessthan
              },
            rating:{
                $eq: searchrating,

            }
          })
			.where("category")
			.in([...category])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);
			

        const total = await Product.countDocuments({
            category: { $in: [...category] },
            $or: [
                  { name: { $regex: search,$options: "i" } },
                  { description: { $regex: search,$options: "i"} },
                  { category: { $regex: search,$options: "i"} },
                ],

        });

		const response = {
			success: true,
			total,
			page: page + 1,
			limit,
			categoryoptions: categoryOptions,
			products,
		};

		res.status(200).json(response);
        
   
    } catch (error) {
        res.json({message:"Products not Fetched"}) 
        
    }

}

export const getoneproduct= async (req,res)=>{
    // console.log(req.params.getoneproduct)
    try {
        const oneproduct= await Product.findById(req.params.getoneproduct)
        res.json(oneproduct)
        
    } catch (error) {
        res.json({message:"Not Found this Product"})  
    }
}

export const deleteoneproduct= async (req,res)=>{
    // console.log(req.params.getoneproduct)
    try {
        const deleteoneproduct= await Product.findByIdAndDelete(req.params.deleteoneproduct)
        res.json({message:"Product Deleted Successfully"})
        
    } catch (error) {
        res.json({message:"Product Not Deleted"})  
    }
}
export const updateoneproduct= async (req,res)=>{
    // console.log(req.params.getoneproduct)
    try {
        const updateoneproduct= await Product.findByIdAndUpdate(req.params.updateoneproduct,req.body,{
            new:true,
        })
        res.json(updateoneproduct)
        
    } catch (error) {
        res.json({message:"Product Not Updated"})  
    }
}
//Create a review or if review is already update that review.
export const reviewcreateandupdate= async (req,res)=>{
    const { rating, comment, productId } = req.body;

   

    console.log(productId)
    const product = await Product.findById(productId);

    console.log(product)
  
   
    const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.auth._id.toString()
    );

    console.log(isReviewed)
    
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.auth._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {

      product.reviews.push({
        user: req.auth._id,
        name: req.auth.name,
        rating: Number(rating),
        comment,
      });

      product.numberofreviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.rating = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
}
// Get All Reviews of a product
export const allreviewsofproduct = async (req, res) => {
    console.log(req.query.getProductReviews)
    try {
        const product = await Product.findById(req.query.allreviewsofproduct);
  
    if (!product) {
      return res.json("Not Found")
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
    } catch (error) {
        res.status(400).json({
          error: "Error",
          });
    }
  };
// Delete Review
export const deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return res.json("Product not found");
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.deletereviewid.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let rating = 0;
  
    if (reviews.length === 0) {
        rating = 0;
    } else {
        rating = avg / reviews.length;
    }
  
    const numberofreviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        rating,
        numberofreviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({ 
      success: true,
    });
  };
export const allAdminnnproduct = async (req, res) => {
    console.log(req.query.getProductReviews)
    try {
      const allproducts= await Product.find({})  
   
  
    res.status(200).json({
      allproducts,
    });
    } catch (error) {
        res.status(400).json({
          error: "Error",
          });
    }
  };





