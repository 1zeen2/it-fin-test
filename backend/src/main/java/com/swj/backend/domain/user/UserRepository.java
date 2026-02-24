package com.swj.backend.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	// 유저 정보가 없을 수도 있으므로 NullPointerException 방지를 위해 Optional 사용.
	Optional<User> findByEmail(String email);
	
	Optional<User> findByLoginId(String loginId);
	
	boolean existsByEmail(String email);
	
	boolean existsByLoginId(String loginId);
}
