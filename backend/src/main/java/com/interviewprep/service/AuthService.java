package com.interviewprep.service;

import com.interviewprep.dto.AuthResponse;
import com.interviewprep.dto.LoginRequest;
import com.interviewprep.dto.RegisterRequest;
import com.interviewprep.dto.UserDto;
import com.interviewprep.entity.User;
import com.interviewprep.exception.ApiException;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Transactional
public AuthResponse register(RegisterRequest request) {
    System.out.println("STEP 1");

    String email = request.email().trim().toLowerCase();

    System.out.println("STEP 2");

    if (userRepository.existsByEmail(email)) {
        throw new ApiException("An account already exists with this email.", HttpStatus.CONFLICT);
    }

    System.out.println("STEP 3");

    User user = new User();
    user.setName(request.name().trim());
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(request.password()));

    System.out.println("STEP 4");

    User savedUser = userRepository.save(user);

    System.out.println("STEP 5");

    return toAuthResponse(savedUser);
}
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found.", HttpStatus.NOT_FOUND));
        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(jwtService.generateToken(user), new UserDto(user.getId(), user.getName(), user.getEmail()));
    }
}
