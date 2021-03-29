writeCode

Insert the data present in users.json into local mongodb database using `mongoimport` into a database called sample and collection named as users.

Write aggregation queries to perform following tasks.

1. Find all users who are active.

```js
db.users.aggregate([{ $match: { isActive: true } }]).pretty();
```

2. Find all users whose name includes `blake` case insensitive.

```js
db.users
  .aggregate([{ $match: { name: { $regex: 'blake', $options: 'i' } } }])
  .pretty();
```

3. Find all males.

```js
db.users.aggregate([{ $match: { gender: 'male' } }, {}]).pretty();
```

4. Find all active males.

```js
db.users.aggregate([{ $match: { isActive: true, gender: 'male' } }]).pretty();
```

5. Find all active females whose age is >= 25.

```js
db.users
  .aggregate([
    { $match: { isActive: true, gender: 'female', age: { $gte: 25 } } },
  ])
  .pretty();
```

6. Find all 40+ males with green eyecolor.

```js
db.users
  .aggregate([
    { $match: { eyecolor: 'green', gender: 'male', age: { $gte: 40 } } },
  ])
  .pretty();
```

7. Find all blue eyed men working in 'USA'.

```js
db.users
  .aggregate([
    {
      $match: {
        eyecolor: 'blue',
        gender: 'male',
        country: { company: { location: 'USA' } },
      },
    },
  ])
  .pretty();

db.users
  .aggregate([
    {
      $match: {
        eyecolor: 'blue',
        gender: 'male',
        'company.country.location': { $in: ['USA'] },
      },
    },
  ])
  .pretty();
```

8. Find all female working in Germany with green eyes and apple as favoriteFruit.

9. Count total male and females.

```js
db.users.aggregate([
  {
    $group: {
      _id: '$gender',
      count: { $sum: 1 },
    },
  },
]);
```

10. Count all whose eyeColor is green.

```js
db.users.aggregate([
  { $match: { eyeColor: 'green' } },
  { $group: { _id: '$eyeColor', count: { $sum: 1 } } },
]);
```

11. Count all 20+ females who have brown eyes.

```js
db.users.aggregate([
  { $match: { eyeColor: 'brown', gender: 'female', age: { $gte: 20 } } },
  { $group: { _id: '$eyeColor', count: { $sum: 1 } } },
]);
```

12. Count all occurences of all eyeColors.
    Something like:-

```
blue -> 30
brown -> 67
green -> 123
```

```js
db.users.aggregate([{ $group: { _id: '$eyeColor', count: { $sum: 1 } } }]);
```

13. Count all females whose tags array include `amet` in it.

```js
db.users.aggregate([
  { $match: { tags: { $in: ['amet'] }, gender: 'female' } },
  { $group: { _id: '$gender', count: { $sum: 1 } } },
]);
```

14. Find the average age of entire collection

```js
db.users.aggregate([
  {
    $group: {
      _id: null,
      avg_age: { $avg: '$age' },
    },
  },
]);
```

15. Find the average age of males and females i.e. group them by gender.

```js
db.users.aggregate([
  {
    $group: {
      _id: '$gender',
      avg_age: { $avg: '$age' },
    },
  },
]);
```

16. Find the user with maximum age.

```js
db.users.aggregate({ $group: { _id: null, max: { $max: '$age' } } });

db.users.aggregate({ $match: { age: { $max: '$age' } } });
```

17. Find the document with minimum age.

```js
db.users.aggregate({ $group: { _id: null, min: { $min: '$age' } } });
```

18. Find the sum of ages of all males and females.

```js
db.users.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: '$age' },
    },
  },
]);
```

19. Group all males by their eyeColor.

```js
db.users.aggregate([
  {
    $group: {
      _id: '$eyeColor',
      count: { $sum: 1 },
    },
  },
]);

db.users
  .aggregate({
    $group: {
      _id: '$eyeColor',
      records: {
        $push: '$$ROOT',
      },
      count: {
        $sum: 1,
      },
    },
  })
  .pretty();
```

20. group all 30+ females by their age.

```js
db.users
  .aggregate([
    { $match: { gender: 'female', age: { $gte: 30 } } },
    {
      $group: {
        _id: '$gender',
        records: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      },
    },
  ])
  .pretty();
```

21. Group all 23+ males with blue eyes working in Germany.

```js
db.users
  .aggregate([
    { $match: { gender: 'female', age: { $gte: 30 } } },
    {
      $group: {
        _id: '$gender',
        records: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      },
    },
  ])
  .pretty();
```

22. Group all by tag names i.e. use \$unwind since tags are array.

23. Group all males whose favoriteFruit is `banana` who have registered before 2015.

```js
db.users
  .aggregate([
    { $match: { favoriteFruit: 'banana' } },
    {
      $group: {
        _id: '$favoriteFruit',
        records: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      },
    },
  ])
  .pretty();
```

24. Group all females by their favoriteFruit.

```js
db.users
  .aggregate({
    $group: {
      _id: '$favoriteFruit',
      records: {
        $push: '$$ROOT',
      },
      count: {
        $sum: 1,
      },
    },
  })
  .pretty();
```

25. Scan all the document to retrieve all eyeColors(use db.COLLECTION_NAME.distinct);

```js
db.users.distinct('eyeColor');
```

26. Find all apple loving blue eyed female working in 'USA'. Sort them by their registration date in descending order.

```js
db.users
  .aggregate([
    { $match: { favoriteFruit: 'apple' } },
    {
      $group: {
        _id: '$favoriteFruit',
        records: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      },
    },
  ])
  .pretty();
```

27. Find all 18+ inactive men and return only the fields specified below in the below provided format

```js
{
  name: "",
  email: '';
  identity: {
    eye: '',
    phone: '',
    location: ''
  }
}
```

```js
db.users
  .aggregate([
    { $match: { isActive: false, gender: 'male', age: { $gte: 18 } } },
    {
      $project: {
        name: 1,
        email: 1,
        identity: {
          eye: $eyeColor,
          phone: '$company.phone',
          location: '$company.location',
        },
      },
    },
  ])
  .pretty();
```
