\*Facebook
// MessageHandler
messageHandler.start()
messageHandler.create()
messageHandler.checkisNullAttachment()
// PostHandler

// CommentHandler
commentHandler.onAddComment()
commentHandler.onEdittedComment()
commentHandler.onDeleteComment()
commentHandler.onHideComment()
commentHandler.onUnHideComment()
commentHandler.createComment()
commentHandler.getAttachments()
commentHandler.createPost()

// ReferralHandler
create()

// ReferralProductHandler
processReferralProduct()
productWithVariants()
productWithNoVariants()
processReferralProductVariant()

// ReferralOthersHandler
upsertReferral()

// PostBackHandler
handlePostbackPayload()

- try to send GET_START message

\*Misc.

// SharedService
sharedService.start()
sharedService.setMessageToDB()

// PageService
getPageByFacebookPageID()

// AudienceService
updateIncomingAudienceStatus()

// LeadService
getReferral()
getFormNameByID()

// Helper etc.
