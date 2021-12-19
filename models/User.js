const {Model, DataTypes}=require('sequelize');
const sequelize=require('../config/connection');
const bcrypt=require('bcrypt');

//User Model
class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw,this.password);
    }
};

//Columns and Configurations
User.init(
    {
        //id column
        id:{
            type: DataTypes.INTEGER,
            //allowNull is the equivalent of NOTNULL in SQL
            allowNull: false,
            //This is the primary Key
            primaryKey: true,
            //turns on auto increment
            autoIncrement: true,
        },
        //username column
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        //password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //required length of the password
                len:[5]
            }
        }
    },
    {
        hooks: {
            async beforeCreate(newUserData) {
                newUserData.password=await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            async beforeUpdate(updateUserData) {
                updateUserData.password=await bcrypt.hash(updateUserData.password, 10);
                return updateUserData;
            }
        },
        sequelize,
        timestamps: false,
        //freezeeTableName will keep from pluralizing the database tables
        freezeTableName: true,
        //this makes it so it would be read as comment_text and not commentText
        underscored: true,
        //makes it so the model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports=User;
