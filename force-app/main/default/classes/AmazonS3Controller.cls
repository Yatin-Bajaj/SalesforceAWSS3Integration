public with sharing class AmazonS3Controller {
    @AuraEnabled
    public static string GetS3CSVFileData(String fileName,String SObjectName){
        // Accounts.csv
        String endpoint = 'callout:AWSS3Service/accounts-test12/'+fileName.trim();
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod('GET');
            
            HttpResponse response = http.send(request);
            if(response.getStatusCode() == 200){

                System.debug('Response = '+ response.getBody());
                System.debug(response.getBodyAsBlob());
                
               
                List<List<String>> csvColumns= parseCSVFileData(response.getBody());
                System.debug(csvColumns);

                // TODO: update function calling
                if(SObjectName == 'Account'){
                    insertAccountData(csvColumns);
                }else if(SObjectName == 'Contact'){
                    insertContactData(csvColumns);
                }
                
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return 'Hello';
    }

    public static List<List<String>> parseCSVFileData(String responseBody){
        // TODO: Write Parse Data code
        List<String> csvRows= responseBody.split('\n');
        List<List<String>> csvColumns = new List<List<String>>();
        for(Integer i=1;i<csvRows.size();i++){
            csvColumns.add(csvRows[i].split(','));
        }
        return csvColumns;
    }

    public static void insertAccountData(List<List<String>> csvColumns){
        // TODO: Write insert Data code
        List<Account> accList = new List<Account>();
        for(List<String> column:csvColumns){
            Account newAcc = new Account();
            newAcc.Name = column[0];
            newAcc.Industry = column[1];
            newAcc.ExtSysAccId__c = column[2];
            accList.add(newAcc);
        }
        Database.SaveResult[] results = Database.insert(accList, false);
    
        for(Database.SaveResult saveres: results){
            if(saveres.isSuccess()){
                System.debug('Successfully inserted account. Account ID: ' + saveres.getId());
            }else{
                for(Database.Error err:saveres.getErrors()){
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Account fields that affected this error: ' + err.getFields());
                }
            }
        }
    }

    public static void insertContactData(List<List<String>> csvColumns){
        List<Contact> contactList = new List<Contact>();
        for(List<String> column:csvColumns){
            Contact newCon = new Contact(
                Account=new Account(ExtSysAccId__C=column[0]),
                FirstName=column[1],
                LastName = column[2],
                ExtSysContactId__c = column[3]
            );
           
            contactList.add(newCon);
        }
        
        Database.SaveResult[] results = Database.insert(contactList, false);

        for(Database.SaveResult saveres: results){
            if(saveres.isSuccess()){
                System.debug('Successfully inserted account. Account ID: ' + saveres.getId());
            }else{
                for(Database.Error err:saveres.getErrors()){
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Account fields that affected this error: ' + err.getFields());
                }
            }
        }
    }
}