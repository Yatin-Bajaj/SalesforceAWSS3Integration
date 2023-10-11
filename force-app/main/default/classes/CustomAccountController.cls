public with sharing class CustomAccountController {
//    @AuraEnabled(cacheable=true)
    @AuraEnabled
    public static List<Account> getAccountsList(Integer rowLimit){
        try {
            List<Account> accList = [select Id,Name,Industry,ExtSysAccId__C,(select Id,LastName,FirstName from Contacts) from Account ORDER BY CreatedDate DESC LIMIT:rowLimit];
            System.debug(accList);
            return accList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    
    public static List<Contact> getContactListByAccId(Id accId){
        try {
            List<Contact> contactList = [select Id,LastName,FirstName,ExtSysContactId__c  from contact where AccountId =:accId ];
            System.debug(contactList);
            return contactList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}