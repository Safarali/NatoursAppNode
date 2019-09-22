const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// const User = require('./userModel');
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less than 40 characters'],
            minlength: [10, 'A tour name must have more than 10 characters']
            // validate: [validator.isAlpha, 'Tour name must only contain letters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must belov 5.0'],
            set: value => Math.round(value * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message: 'Dicount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now()
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Compound Indexing
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create(), not for update()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// It embeddes User document into tour document
// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async guideId => await User.findById(guideId));

//     this.guides = await Promise.all(guidesPromises);
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordResetExpires -passwordResetToken -passwordChangedAt'
    });
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
