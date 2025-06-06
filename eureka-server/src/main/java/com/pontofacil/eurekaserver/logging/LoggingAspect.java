package com.pontofacil.eurekaserver.logging;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

@Before("execution(* com.pontofacil..controller..*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("[LOG] Executando método: " + joinPoint.getSignature().getName());
    }
}
