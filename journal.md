# EEATO DOCUMENTATION

## Everything, Everywhere, All aT Once

### DATA STRUCTURES

1. User(FIREBASE): 

```javascript
    {
        User_id : string,
        Username : string,
        Password : string,
        Email: string
```

2. User:

```javascript
    {
        User_id : string,
        PIN : string,
        FullName : [first, middle?, last],
        Dob : date,
        IDNumber : string,
        Address : [housenumber, street, city, country],
        PhoneNumber : [home?, work?, cell],
        Website? : link, 
        IntroductoryParagraph : string(html, 20words),
        Letter : string(html, 500words),
        Extra_Detail_PDF : file_link_gdrive,
        Languages : [],
        Skills : [],
        Hobbies : [],
        Detail : [],
        Reviews : [{organisationId, message}],
        Grade7? : {
            exam_board : string,
            school : string,
            year : number,
            results : number,
            number_of_subjects : number
        },
        OLevel? : {
            exam_board : string,
            school : string,
            year : number,
            results : [{name_of_subject : string, symbol : string}]
        },
        ALevel? : {
            exam_board : string,
            school : string,
            year : number,
            results : [{name_of_subject : string, symbol : string}]
        },
        CareerQualification? : {
            institution : [string],
            description : string(html, 50words)
        }
    }
```

3. Organisation:

```javascript
    {
        user_id : string,
        Title : string,
        FullName : string,
        Address : [number, street, city, country],
        PhoneNumber : [],
        Website? : link, 
        IntroductoryParagraph : string(html, 20words),
        About : string(html, 500words),
        Type : string
    }
```

4. Programs/Positions:

```javascript
    {
        ID : string,
        Title : string,
        SubTitle: string,
        Organisation_ID : string,
        Message : string(html),
        Applicants : [{
            user : |id|,
            options : [strings],
            applicationDate : datetime
        }],
        DateTimeOfPost : datetime,
        DeadLine : datetime
    }
```

5. Finance:

```javascript
    {
        ID : string,
        DateTime : datetime,
        Type : "Income/Expenditure",
        From : UserID / AccountNumber,
        To : UserID / AccountNumber
    }
```
