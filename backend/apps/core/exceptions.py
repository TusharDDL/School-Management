class SchoolManagementException(Exception):
    """Base exception class for School Management System"""
    pass

class SchoolApprovalError(SchoolManagementException):
    """Raised when there's an error in school approval process"""
    pass

class FreeTierLimitExceeded(SchoolManagementException):
    """Raised when school exceeds free tier limits"""
    pass

class AcademicYearConfigError(SchoolManagementException):
    """Raised when there's an error in academic year configuration"""
    pass

class FeeModuleError(SchoolManagementException):
    """Raised when there's an error in fee module operations"""
    pass

class EmailDeliveryError(SchoolManagementException):
    """Raised when there's an error in sending emails"""
    pass
